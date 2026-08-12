CC = nvcc
BIN = bin

all: $(BIN)/sger $(BIN)/lda.sger

$(BIN):
	mkdir -p $(BIN)

$(BIN)/sger: sger.c ../../utils/helpers.h | $(BIN)
	$(CC) sger.c -o $(BIN)/sger -lcublas

$(BIN)/lda.sger: lda.sger.c ../../utils/helpers.h | $(BIN)
	$(CC) lda.sger.c -o $(BIN)/lda.sger -lcublas

clean:
	rm -rf $(BIN)
