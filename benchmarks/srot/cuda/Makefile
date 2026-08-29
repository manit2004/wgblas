CC = nvcc
BIN = bin

all: $(BIN)/cosine.srot $(BIN)/sine.srot $(BIN)/srot $(BIN)/stride.srot

$(BIN):
	mkdir -p $(BIN)

$(BIN)/cosine.srot: cosine.srot.c ../../utils/helpers.h | $(BIN)
	$(CC) cosine.srot.c -o $(BIN)/cosine.srot -lcublas

$(BIN)/sine.srot: sine.srot.c ../../utils/helpers.h | $(BIN)
	$(CC) sine.srot.c -o $(BIN)/sine.srot -lcublas

$(BIN)/srot: srot.c ../../utils/helpers.h | $(BIN)
	$(CC) srot.c -o $(BIN)/srot -lcublas

$(BIN)/stride.srot: stride.srot.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.srot.c -o $(BIN)/stride.srot -lcublas

clean:
	rm -rf $(BIN)
