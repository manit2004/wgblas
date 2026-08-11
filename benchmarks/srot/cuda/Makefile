CC = nvcc
BIN = bin

all: $(BIN)/srot $(BIN)/stride.srot

$(BIN):
	mkdir -p $(BIN)

$(BIN)/srot: srot.c ../../utils/helpers.h | $(BIN)
	$(CC) srot.c -o $(BIN)/srot -lcublas

$(BIN)/stride.srot: stride.srot.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.srot.c -o $(BIN)/stride.srot -lcublas

clean:
	rm -rf $(BIN)
