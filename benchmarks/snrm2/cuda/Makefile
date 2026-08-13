CC = nvcc
BIN = bin

all: $(BIN)/snrm2 $(BIN)/stride.snrm2

$(BIN):
	mkdir -p $(BIN)

$(BIN)/snrm2: snrm2.c ../../utils/helpers.h | $(BIN)
	$(CC) snrm2.c -o $(BIN)/snrm2 -lcublas

$(BIN)/stride.snrm2: stride.snrm2.c ../../utils/helpers.h | $(BIN)
	$(CC) stride.snrm2.c -o $(BIN)/stride.snrm2 -lcublas

clean:
	rm -rf $(BIN)
